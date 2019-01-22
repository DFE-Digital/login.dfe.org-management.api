jest.mock('./../../../src/infrastructure/data', () => {
  return {
    getOrgById: jest.fn(),
  }
});

jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').mockLogger());

const { mockRequest, mockResponse } = require('./../../utils');
const { getOrgById } = require('./../../../src/infrastructure/data');
const getOrganisation = require('./../../../src/app/organisations/getOrganisation');

const res = mockResponse();

describe('when getting an org by id', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'organisation1',
      },
    });

    getOrgById.mockReset().mockReturnValue({
      id: 'organisation1',
      name: 'test org',
      urn: '12345',
      category: {
        id: '004',
        name: 'Early Years Setting',
      },
      legacyId: '12345'
    })
  });

  it('it should get the entity from data store', async () => {
    await getOrganisation(req, res);
    expect(getOrgById).toHaveBeenCalledTimes(1);
    expect(getOrgById).toHaveBeenCalledWith(req.params.id);
  });

  it('then it should return json for organisation', async () => {
    await getOrganisation (req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json.mock.calls[0][0]).toEqual({
      id: 'organisation1',
      name: 'test org',
      urn: '12345',
      category: {
        id: '004',
        name: 'Early Years Setting',
      },
      legacyId: '12345'
    });
  });

  it('then it should return 404 if no organisation with id', async () => {
    getOrgById.mockReturnValue(undefined);

    await getOrganisation(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
