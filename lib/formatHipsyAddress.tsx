export function formatHipsyAddress(address: string) {
  const regexLocation = /^([^,]+),?.*$/i;
  const regexCity = /\d{4}\s*[a-zA-Z]{2}\b\s*([^,]+),\s*Nederland$/;

  const matchLocation = address.match(regexLocation);
  const matchCity = address.match(regexCity);

  let location = "";
  if (matchLocation) {
    location += matchLocation[1].trim();
  }
  if (matchCity) {
    if (matchLocation) {
      location += ", ";
    }
    location += matchCity[1].trim();
  }
  if (!matchLocation && !matchCity) {
    location = address;
  }
  return location;
}
