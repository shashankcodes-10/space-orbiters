// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RouterLink from "./RouterLink";

describe("RouterLink", () => {
  it("renders the link correctly", () => {
    render(
      <MemoryRouter>
        <RouterLink href="/planets">Planets</RouterLink>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Planets" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/planets");
  });
});