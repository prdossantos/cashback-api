export const mockRequest = () => {
    const req: any = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.query = jest.fn().mockReturnValue(req)
    return req
}

export const mockResponse = () => {
    const res: any = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

export const expects = {
    toBeInJson(received: any, attr: string, value: any) {
        let pass = false
        if (received.data) {
            pass = typeof received.data[attr] == 'string' ? received.data[attr].indexOf(value) > -1 : received.data[attr] == value;
        } else {
            pass = typeof received[attr] == 'string' ? received[attr].indexOf(value) > -1 : received[attr] == value;
        }
        if (pass) {
            return {
                message: () =>
                    `expected ${received} does not contain the value ${value} in the attribute ${attr} `,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${received} contains the value ${value} in the attribute ${attr}`,
                pass: false,
            };
        }
    },
}