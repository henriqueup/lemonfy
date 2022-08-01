import Home from "../../pages/index";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Home page", () => {
    it("It renders our Home Page", () => {
        render(<Home />);
        // check if all components are rendered
        expect(screen.getByTestId("title")).toBeInTheDocument();
        expect(screen.getByTestId("paragraph")).toBeInTheDocument();
        expect(screen.getByTestId("docs")).toBeInTheDocument();
        expect(screen.getByTestId("learn")).toBeInTheDocument();
        expect(screen.getByTestId("examples")).toBeInTheDocument();
        expect(screen.getByTestId("deploy")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
        expect(screen.getByTestId("vercel-image")).toBeInTheDocument();
    });
});
