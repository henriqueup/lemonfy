import { mockModuleFunctions } from "src/mocks/utils";

describe("Mock entire modules", () => {
  it("Returns object with mocked methods", () => {
    const testModule = {
      someConst: "abc",
      otherConst: 23,
      voidMethod: () => {
        return;
      },
      someMethod: (a: number) => a,
    };

    const result = mockModuleFunctions(testModule);

    expect(result.someConst).toBe("abc");
    expect(result.otherConst).toBe(23);
    expect(jest.isMockFunction(result.voidMethod)).toBe(true);
    expect(jest.isMockFunction(result.someMethod)).toBe(true);

    const someMethodInitialResult = result.someMethod(2);
    expect(someMethodInitialResult).toBeUndefined();

    (result.someMethod as jest.Mock).mockImplementationOnce(() => 2);
    const someMethodResultAfterMock = result.someMethod(3);
    expect(someMethodResultAfterMock).toBe(2);
  });

  it("Skips already mocked methods", () => {
    const someMethod = (a: number) => a;
    const alreadyMocked = jest.fn();
    const testModule = {
      someConst: "abc",
      otherConst: 23,
      alreadyMocked,
      someMethod,
    };

    const result = mockModuleFunctions(testModule);

    expect(result.someConst).toBe("abc");
    expect(result.otherConst).toBe(23);
    expect(jest.isMockFunction(result.alreadyMocked)).toBe(true);
    expect(jest.isMockFunction(result.someMethod)).toBe(true);

    expect(result.alreadyMocked).toBe(alreadyMocked);
    expect(result.someMethod).not.toBe(someMethod);
  });
});
