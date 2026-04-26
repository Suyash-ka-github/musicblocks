// Copyright (c) 2026 Music Blocks Contributors
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the The GNU Affero General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.

global._ = jest.fn(str => str);
global.setCookie = jest.fn();
global.getCookie = jest.fn(() => "");
global.StringHelper = jest.fn();
global.ProjectStorage = jest.fn();
global.ServerInterface = jest.fn();
global.Converter = jest.fn();
global.SaveInterface = jest.fn();
global.LocalPlanet = jest.fn();
global.GlobalPlanet = jest.fn();

const Planet = require("../Planet");

describe("Planet", () => {
    let planet;

    beforeEach(() => {
        planet = new Planet(true, {});
        planet.ProjectStorage = {
            data: {
                Projects: {
                    proj1: { ProjectData: "data-1" },
                    proj2: { ProjectData: "data-2" }
                }
            },
            getCurrentProjectID: jest.fn(),
            getCurrentProjectData: jest.fn()
        };
        planet.loadProjectFromData = jest.fn();
        planet.loadNewProject = jest.fn();
        planet.planetClose = jest.fn();
        planet.oldCurrentProjectID = "proj1";
    });

    it("closeButton should load the replacement project after the current one is deleted", async () => {
        planet.ProjectStorage.getCurrentProjectID.mockReturnValue("proj2");
        planet.ProjectStorage.getCurrentProjectData.mockResolvedValue("data-2");

        await planet.closeButton();

        expect(planet.loadProjectFromData).toHaveBeenCalledWith("data-2");
        expect(planet.loadNewProject).not.toHaveBeenCalled();
        expect(planet.planetClose).not.toHaveBeenCalled();
    });

    it("closeButton should create a new project when the deleted project has no replacement", async () => {
        planet.ProjectStorage.data.Projects = {};
        planet.ProjectStorage.getCurrentProjectID.mockReturnValue(undefined);
        planet.ProjectStorage.getCurrentProjectData.mockResolvedValue(null);

        await planet.closeButton();

        expect(planet.loadNewProject).toHaveBeenCalledWith({ minimalStart: true });
        expect(planet.loadProjectFromData).not.toHaveBeenCalled();
        expect(planet.planetClose).not.toHaveBeenCalled();
    });

    it("closeButton should close normally when the original project still exists", async () => {
        planet.ProjectStorage.getCurrentProjectID.mockReturnValue("proj1");
        planet.ProjectStorage.getCurrentProjectData.mockResolvedValue("data-1");

        await planet.closeButton();

        expect(planet.planetClose).toHaveBeenCalled();
        expect(planet.loadNewProject).not.toHaveBeenCalled();
        expect(planet.loadProjectFromData).not.toHaveBeenCalled();
    });
});
