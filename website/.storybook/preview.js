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
