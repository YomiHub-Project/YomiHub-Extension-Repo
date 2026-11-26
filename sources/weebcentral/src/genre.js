load('config.js');
function execute() {
  var base = BASE_URL + "/search/data?text=&display_mode=Full+Display&order=Descending&official=Any&anime=Any&adult=Any";
  var cats = [
    ["Manga", base + "&sort=Popularity&included_type=Manga"],
    ["Manhwa", base + "&sort=Popularity&included_type=Manhwa"],
    ["Manhua", base + "&sort=Popularity&included_type=Manhua"],
    ["OEL", base + "&sort=Popularity&included_type=OEL"],
    ["Ongoing", base + "&sort=Latest+Updates&included_status=Ongoing"],
    ["Complete", base + "&sort=Popularity&included_status=Complete"],
    ["Popular", base + "&sort=Popularity"],
    ["Latest Updates", base + "&sort=Latest+Updates"],
    ["Action", base + "&sort=Popularity&included_tag=Action"],
    ["Adventure", base + "&sort=Popularity&included_tag=Adventure"],
    ["Comedy", base + "&sort=Popularity&included_tag=Comedy"],
    ["Drama", base + "&sort=Popularity&included_tag=Drama"],
    ["Fantasy", base + "&sort=Popularity&included_tag=Fantasy"],
    ["Horror", base + "&sort=Popularity&included_tag=Horror"],
    ["Isekai", base + "&sort=Popularity&included_tag=Isekai"],
    ["Mystery", base + "&sort=Popularity&included_tag=Mystery"],
    ["Psychological", base + "&sort=Popularity&included_tag=Psychological"],
    ["Romance", base + "&sort=Popularity&included_tag=Romance"],
    ["Sci-fi", base + "&sort=Popularity&included_tag=Sci-fi"],
    ["Seinen", base + "&sort=Popularity&included_tag=Seinen"],
    ["Shounen", base + "&sort=Popularity&included_tag=Shounen"],
    ["Slice of Life", base + "&sort=Popularity&included_tag=Slice+of+Life"],
    ["Supernatural", base + "&sort=Popularity&included_tag=Supernatural"]
  ];
  return Response.success(cats.map(function (c) {
    return { title: c[0], input: c[1], script: "search.js" };
  }));
}
