import { basePath } from "./basePath";

export function getFontFacesCSS() {
  const root = basePath || "";
  const font = (file) => `${root}/fonts/Gogo/${file}`;

  return `
@font-face {
  font-family: "Gogo-semibold";
  src: local("Gogo"), url("${font("Gogo-SemiBold.ttf")}") format("truetype");
  font-weight: semibold;
}
@font-face {
  font-family: "Gogo-normal";
  src: local("Gogo"), url("${font("Gogo-Regular.ttf")}") format("truetype");
  font-weight: normal;
}
@font-face {
  font-family: "Gogo-medium";
  src: local("Gogo"), url("${font("Gogo-Medium.ttf")}") format("truetype");
  font-weight: medium;
}
`.trim();
}
