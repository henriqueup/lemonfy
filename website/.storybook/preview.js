//This is to de-optimize next-images!
//So we don't need the nextjs server running to use next images.
import * as NextImage from "next/image";
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, "default", {
    configurable: true,
    value: (props) => <OriginalNextImage {...props} unoptimized />,
});
//This file holds sharef configurations for all .stories files!
//Will import the global styles here!
import "../styles/globals.css";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
