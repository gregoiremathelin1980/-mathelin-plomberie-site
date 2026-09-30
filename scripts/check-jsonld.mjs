const url = process.argv[2] || "https://www.mathelin-plomberie.fr/blog";
const html = await fetch(url).then((r) => r.text());
const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let m;
let i = 0;
while ((m = re.exec(html))) {
  i++;
  const j = JSON.parse(m[1]);
  console.log(`Block ${i}: @type=${JSON.stringify(j["@type"])} agg=${!!j.aggregateRating} @id=${j["@id"] || "none"}`);
}
console.log(`Total blocks: ${i}`);
const aggMatches = [...html.matchAll(/aggregateRating/g)].map((m) => m.index);
console.log(`aggregateRating string positions: ${aggMatches.join(", ")}`);
for (const pos of aggMatches) {
  console.log(`  context: ...${html.slice(Math.max(0, pos - 20), pos + 40)}...`);
}

function findAgg(o, p = "root") {
  if (!o || typeof o !== "object") return;
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (k === "aggregateRating") console.log(`  aggregateRating at ${p}.${k}`);
    if (v && typeof v === "object") findAgg(v, `${p}.${k}`);
  }
}
const first = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (first) {
  console.log("Paths:");
  findAgg(JSON.parse(first[1]));
}
