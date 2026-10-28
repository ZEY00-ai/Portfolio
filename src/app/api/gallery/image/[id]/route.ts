type RouteContext = {
  params: Promise<{ id: string }>;
};

function imageError(status: number, message: string) {
  return new Response(message, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return imageError(400, "Invalid Google Drive file ID.");
  }

  const imageUrls = [
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`,
    `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`,
  ];

  for (const imageUrl of imageUrls) {
    let upstream: Response;
    try {
      upstream = await fetch(imageUrl, { cache: "no-store" });
    } catch (error) {
      console.warn("Gagal mengambil thumbnail publik dari Google Drive:", error);
      continue;
    }

    const contentType = upstream.headers.get("content-type")?.split(";")[0];
    if (!upstream.ok || !contentType?.startsWith("image/") || !upstream.body) {
      continue;
    }

    const contentLength = upstream.headers.get("content-length");
    return new Response(upstream.body, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        ...(contentLength ? { "Content-Length": contentLength } : {}),
      },
    });
  }

  return imageError(502, "Google Drive tidak mengirimkan data gambar.");
}
