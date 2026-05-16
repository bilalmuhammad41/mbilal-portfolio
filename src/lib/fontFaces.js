import { basePath } from "./basePath";

export function getFontFacesCSS() {
  const root = basePath || "";
  const font = (file) => `${root}/fonts/Gilroy/${file}`;

  return `
@font-face {
  font-family: "Gilroy-semibold";
  src: local("Gilroy"), url("${font("Gilroy-SemiBold.ttf")}") format("truetype");
  font-weight: semibold;
}
@font-face {
  font-family: "Gilroy-normal";
  src: local("Gilroy"), url("${font("Gilroy-Regular.ttf")}") format("truetype");
  font-weight: normal;
}
@font-face {
  font-family: "Gilroy-medium";
  src: local("Gilroy"), url("${font("Gilroy-Medium.ttf")}") format("truetype");
  font-weight: medium;
}
`.trim();
}
