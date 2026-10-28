export type GalleryImage = {
  id: string;
  name: string;
  viewUrl: string;
};

export type GalleryCollection = {
  id: string;
  title: string;
  folderUrl?: string;
  status: "setup" | "invalid-folder-url" | "empty" | "ready" | "error";
  images: GalleryImage[];
  message?: string;
};

export type GalleryResult =
  | { status: "setup" }
  | { status: "error"; message: string }
  | { status: "ready"; collections: GalleryCollection[] };

type DriveFile = {
  id: string;
  name: string;
  thumbnailLink?: string;
  webViewLink?: string;
};

type DriveListResponse = {
  files: DriveFile[];
};

class DriveApiError extends Error {
  constructor(
    readonly status: number,
    readonly reason: string | null,
    readonly apiMessage: string | null,
  ) {
    super(`Google Drive API returned HTTP ${status}`);
    this.name = "DriveApiError";
  }
}

type DriveApiErrorResponse = {
  error?: {
    message?: string;
    errors?: Array<{ reason?: string }>;
  };
};

function isDriveApiErrorResponse(value: unknown): value is DriveApiErrorResponse {
  return typeof value === "object" && value !== null && "error" in value;
}

function isDriveListResponse(value: unknown): value is DriveListResponse {
  if (!value || typeof value !== "object" || !("files" in value)) return false;
  const files = value.files;
  return (
    Array.isArray(files) &&
    files.every(
      (file) =>
        file &&
        typeof file === "object" &&
        "id" in file &&
        typeof file.id === "string" &&
        "name" in file &&
        typeof file.name === "string",
    )
  );
}

function getFolderId(folderUrl: string): string | null {
  try {
    const url = new URL(folderUrl);
    if (url.protocol !== "https:" || url.hostname !== "drive.google.com") {
      return null;
    }

    return url.pathname.match(/\/folders\/([A-Za-z0-9_-]+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

const COLLECTIONS = [
  { id: "sma", title: "Masa SMA", envName: "SMA_GDRIVE_URL" },
  { id: "kuliah", title: "Masa Kuliah", envName: "KULIAH_GDRIVE_URL" },
  { id: "pribadi", title: "Momen Pribadi", envName: "PRIBADI_GDRIVE_URL" },
] as const;

export async function getGallery(): Promise<GalleryResult> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();
  if (!apiKey) return { status: "setup" };

  const collections = await Promise.all(
    COLLECTIONS.map(async ({ id, title, envName }): Promise<GalleryCollection> => {
      const folderUrl = process.env[envName]?.trim();
      const base = { id, title, images: [] as GalleryImage[] };

      if (!folderUrl) return { ...base, status: "setup" };

      const folderId = getFolderId(folderUrl);
      if (!folderId) {
        return {
          ...base,
          folderUrl,
          status: "invalid-folder-url",
          message: "Gunakan URL folder Google Drive, bukan URL file.",
        };
      }

      try {
        const images = await getDriveImages(folderId, apiKey);
        return {
          ...base,
          folderUrl,
          images,
          status: images.length > 0 ? "ready" : "empty",
          message: images.length === 0 ? "Belum ada foto di folder ini." : undefined,
        };
      } catch (error) {
        const status = getDriveErrorStatus(error);
        if (status !== null) {
          console.warn(`Gagal memuat galeri Drive ${envName}: HTTP ${status}`);
        } else {
          console.warn(`Gagal memuat galeri Drive ${envName}:`, error);
        }
        return {
          ...base,
          folderUrl,
          status: "error",
          message: getDriveErrorMessage(error),
        };
      }
    }),
  );

  return { status: "ready", collections };
}

function getDriveErrorStatus(error: unknown): number | null {
  if (typeof error === "object" && error !== null && "status" in error) {
    if (typeof error.status === "number") return error.status;
  }

  if (error instanceof Error) {
    const match = error.message.match(/HTTP (\d{3})/);
    if (match) return Number(match[1]);
  }

  return null;
}

function getDriveErrorMessage(error: unknown): string {
  const status = getDriveErrorStatus(error);
  const reason = error instanceof DriveApiError ? error.reason : null;

  if (status === 403) {
    if (reason === "accessNotConfigured" || reason === "SERVICE_DISABLED") {
      return "Google Drive API belum aktif pada project Google Cloud milik API key. Aktifkan API di project yang sama, lalu tunggu beberapa menit.";
    }
    if (reason === "API_KEY_SERVICE_BLOCKED") {
      return "API key ini tidak mengizinkan Google Drive API. Buka API restrictions dan pilih Google Drive API.";
    }
    if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
      return "API key dibatasi ke Websites/HTTP referrers. Karena request berasal dari server, ubah Application restrictions ke None untuk tes lokal.";
    }
    if (reason === "dailyLimitExceeded" || reason === "rateLimitExceeded") {
      return "Kuota permintaan Google Drive API tercapai. Periksa quota pada Google Cloud Console dan coba lagi nanti.";
    }
    const details = [reason, error instanceof DriveApiError ? error.apiMessage : null]
      .filter(Boolean)
      .join(": ");
    return details
      ? `Google menolak akses Drive (HTTP 403). Detail: ${details}`
      : "Google menolak akses Drive (HTTP 403). Pastikan API key valid, Google Drive API aktif, dan folder dibagikan sebagai Viewer.";
  }
  if (status === 400) {
    if (reason === "keyInvalid" || reason === "API_KEY_INVALID") {
      return "Google menolak API key. Pastikan GOOGLE_DRIVE_API_KEY berisi API key, bukan OAuth Client ID/Secret.";
    }
    return "Google menolak permintaan. Pastikan API key valid dan Google Drive API aktif.";
  }
  if (status === 429) {
    return "Batas permintaan Google Drive tercapai. Coba lagi nanti.";
  }
  if (status === 404) {
    return "Folder tidak ditemukan atau belum bisa diakses. Periksa link dan izin publiknya.";
  }
  if (status === 403 && error instanceof DriveApiError) {
    const details = [error.reason, error.apiMessage].filter(Boolean).join(": ");
    return details
      ? `Google menolak permintaan (HTTP 403). Detail dari Google: ${details}`
      : "Google menolak permintaan (HTTP 403). Periksa API key, konfigurasi Google Drive API, dan akses folder.";
  }
  if (error instanceof DriveApiError && error.apiMessage) {
    return `Google Drive API menolak permintaan${reason ? ` (${reason})` : ""}: ${error.apiMessage}`;
  }
  return "Folder belum bisa dimuat. Periksa konfigurasi Google Drive lalu coba lagi.";
}

async function getDriveImages(
  folderId: string,
  apiKey: string,
): Promise<GalleryImage[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    key: apiKey,
    pageSize: "1000",
    orderBy: "name",
    fields: "files(id,name,mimeType,thumbnailLink,webViewLink)",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const errorResponse = isDriveApiErrorResponse(body) ? body.error : undefined;
    const reason =
      Array.isArray(errorResponse?.errors) &&
      typeof errorResponse.errors[0]?.reason === "string"
        ? errorResponse.errors[0].reason
        : null;
    const apiMessage =
      typeof errorResponse?.message === "string"
        ? errorResponse.message
        : null;
    throw new DriveApiError(response.status, reason, apiMessage);
  }

  const data: unknown = await response.json();
  if (!isDriveListResponse(data)) {
    throw new Error("Respons daftar file Google Drive tidak valid.");
  }

  return data.files
    .filter(
      (file) =>
        "mimeType" in file &&
        typeof file.mimeType === "string" &&
        file.mimeType.startsWith("image/"),
    )
    .map((file) => ({
      id: file.id,
      name: file.name,
      viewUrl:
        ("webViewLink" in file && typeof file.webViewLink === "string"
          ? file.webViewLink
          : null) ?? `https://drive.google.com/file/d/${file.id}/view`,
    }));
}
