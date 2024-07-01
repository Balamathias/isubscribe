// import { describe, it } from "node:test";
// import { getUserMonnifyToken, getReservedAccount, initiateTransfer } from "./index";

// describe("getUserMonnifyToken", () => {
//     it("should return user token", async () => {
//         // Mock the fetch function and return a successful response
//         jest.spyOn(window, "fetch").mockResolvedValueOnce({
//             ok: true,
//             json: jest.fn().mockResolvedValueOnce({ data: { responseBody: { accessToken: "token" } }, status: 200 }),
//         });

//         const result = await getUserMonnifyToken();

//         expect(result).toEqual({ data: { responseBody: { accessToken: "token" } }, status: 200 });
//     });

//     it("should throw an error if fetch fails", async () => {
//         // Mock the fetch function and return an error response
//         jest.spyOn(window, "fetch").mockRejectedValueOnce(new Error("Network error"));

//         await expect(getUserMonnifyToken()).rejects.toThrowError("Network error");
//     });
// });

// describe("getReservedAccount", () => {
//     it("should return reserved account data", async () => {
//         // Mock the fetch function and return a successful response
//         jest.spyOn(window, "fetch").mockResolvedValueOnce({
//             ok: true,
//             json: jest.fn().mockResolvedValueOnce({ data: "reserved account data" }),
//         });

//         const result = await getReservedAccount({});

//         expect(result).toEqual({ data: "reserved account data" });
//     });

//     it("should throw an error if fetch fails", async () => {
//         // Mock the fetch function and return an error response
//         jest.spyOn(window, "fetch").mockRejectedValueOnce(new Error("Network error"));

//         await expect(getReservedAccount({})).rejects.toThrowError("Network error");
//     });
// });

// describe("initiateTransfer", () => {
//     it("should return initiate transfer data", async () => {
//         // Mock the fetch function and return a successful response
//         jest.spyOn(window, "fetch").mockResolvedValueOnce({
//             ok: true,
//             json: jest.fn().mockResolvedValueOnce({ data: "initiate transfer data" }),
//         });

//         const result = await initiateTransfer({});

//         expect(result).toEqual({ data: "initiate transfer data" });
//     });

//     it("should throw an error if fetch fails", async () => {
//         // Mock the fetch function and return an error response
//         jest.spyOn(window, "fetch").mockRejectedValueOnce(new Error("Network error"));

//         await expect(initiateTransfer({})).rejects.toThrowError("Network error");
//     });
// });
