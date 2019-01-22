jest.mock('./../../../src/infrastructure/data', () => {
  return {
    getPagedList: jest.fn(),
    search: jest.fn(),
  }
});

jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').mockLogger());


const { mockRequest, mockResponse } = require('./../../utils');
const { getPagedList, search } = require('./../../../src/infrastructure/data');
const listOrganisations = require('./../../../src/app/organisations/listOrganisations');

const page = {
  organisations: {
    id: 'organisation2'
  },
  totalNumberOfPages: 10,
  totalNumberOfRecords: 200,
};

const searchPage = {
  organisations: {
    id: 'organisation1'
  },
  totalNumberOfPages: 3,
  totalNumberOfRecords: 30,
};

const res = mockResponse();

describe('when listing or searching organisations', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      query: {
        page: 3,
      },
    });

    getPagedList.mockReset().mockReturnValue(page);
    search.mockReset().mockReturnValue(searchPage);
  });

  it('then it should return page of organisations if no search criteria', async () => {
    await listOrganisations(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json.mock.calls[0][0]).toEqual({
      organisations: {
        id: 'organisation2'
      },
      page: 3,
      totalNumberOfPages: 10,
      totalNumberOfRecords: 200,
    });
    expect(getPagedList.mock.calls).toHaveLength(1);
    expect(getPagedList.mock.calls[0][0]).toBe(3);
    expect(getPagedList.mock.calls[0][1]).toBe(25);
  });

  it('then it should return the first page of organisations if no criteria or page specified', async () => {
    req.query.page = undefined;

    await listOrganisations(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json.mock.calls[0][0]).toEqual({
      organisations: {
        id: 'organisation2'
      },
      page: 1,
      totalNumberOfPages: 10,
      totalNumberOfRecords: 200,
    });
    expect(getPagedList.mock.calls).toHaveLength(1);
    expect(getPagedList.mock.calls[0][0]).toBe(1);
    expect(getPagedList.mock.calls[0][1]).toBe(25);
  });

  it('then it should return the filtered organisation if criteria specified', async () => {
    req.query.search = 'organisation1';

    await listOrganisations(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json.mock.calls[0][0]).toEqual({
      organisations: {
        id: 'organisation1'
      },
      page: 3,
      totalNumberOfPages: 3,
      totalNumberOfRecords: 30,
    });
    expect(search.mock.calls).toHaveLength(1);
    expect(search.mock.calls[0][0]).toBe(req.query.search);
    expect(search.mock.calls[0][1]).toBe(3);
    expect(search.mock.calls[0][2]).toBe(25);
  });


});
