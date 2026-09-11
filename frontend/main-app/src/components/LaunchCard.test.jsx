// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LaunchCard from "./LaunchCard";

describe("LaunchCard", () => {
  it("renders launch information correctly", () => {
    const launch = {
      name: "Falcon 9 Test Launch",
      windowstart: "2025-01-15T12:00:00Z",
      location: {
        name: "Kennedy Space Center",
      },
    };

    render(<LaunchCard launch={launch} />);

    expect(screen.getByText("Falcon 9 Test Launch")).toBeInTheDocument();
    expect(screen.getByText(/Launch Window Start:/)).toBeInTheDocument();
    expect(screen.getByText(/Kennedy Space Center/)).toBeInTheDocument();
  });
});