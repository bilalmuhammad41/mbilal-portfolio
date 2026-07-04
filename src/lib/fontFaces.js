import { basePath } from "./basePath";

export function getFontFacesCSS() {
  const root = basePath || "";
  const dmSans = (file) => `${root}/fonts/DMSans/${file}`;

return `/* DM Sans */
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans Thin"), url("${dmSans("DMSans-Thin.ttf")}") format("truetype");
  font-weight: 100;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans ExtraLight"), url("${dmSans("DMSans-ExtraLight.ttf")}") format("truetype");
  font-weight: 200;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans Light"), url("${dmSans("DMSans-Light.ttf")}") format("truetype");
  font-weight: 300;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans"), url("${dmSans("DMSans-Regular.ttf")}") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans Medium"), url("${dmSans("DMSans-Medium.ttf")}") format("truetype");
  font-weight: 500;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans SemiBold"), url("${dmSans("DMSans-SemiBold.ttf")}") format("truetype");
  font-weight: 600;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans Bold"), url("${dmSans("DMSans-Bold.ttf")}") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans ExtraBold"), url("${dmSans("DMSans-ExtraBold.ttf")}") format("truetype");
  font-weight: 800;
}
@font-face {
  font-family: "DM Sans";
  src: local("DM Sans Black"), url("${dmSans("DMSans-Black.ttf")}") format("truetype");
  font-weight: 900;
}
`.trim();
}
