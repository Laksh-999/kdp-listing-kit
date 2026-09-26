export function downloadListing(title: string, content: string) {
  const text = `title\n\n{title}\n\ntitle\n\n{content}`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.slice(0, 40).replace(/[^a-z0-9 ]/gi, "") || "kdp-listing"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
