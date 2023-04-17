import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={710}
    height={710}
    viewBox="0 0 710 710"
    fill="currentColor"
    {...props}
  >
    <path d="M607.52 710H0V102.467h338.253v101.806H100.707V609.3h405.026V372.847h101.803L607.52 710Zm101.807-440.053H607.52v-95.23L339.333 441.811l-71.14-71.156L536.38 102.468h-95.235V.665h268.187l-.005 269.282Z" />
  </svg>
);
export default SvgComponent;
