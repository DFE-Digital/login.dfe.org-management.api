jest.mock('./../../../src/infrastructure/data', () => {
  return {
    updateOrganisation: jest.fn(),
    getOrgById: jest.fn(),
  }
});

jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').mockLogger());

const { mockRequest, mockResponse } = require('./../../utils');
const { updateOrganisation, getOrgById } = require('./../../../src/infrastructure/data');
const updateOrg = require('./../../../src/app/organisations/updateOrganisation');

const res = mockResponse();

describe('when updating an organisation', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      body: {
        name: 'organisation2',
        urn: '1234',
        category: {
          id: '004',
        },
        legacyId: '4567'
      },
      params: {
        id: 'org1',
      }
    });
    getOrgById.mockReset().mockReturnValue({
      id: 'organisation1',
      name: 'test org',
      urn: '1234',
      category: {
        id: '004',
        name: 'Early Years Setting',
      },
      legacyId: '12345'
    });
    updateOrganisation.mockReset();
  });

  it('it should return 400 if no orgId specified', async () => {
    req.params.id = undefined;
    await updateOrg(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toBeCalledWith({
      details: ["Must specify organisation id"]
    });
  });

  it('it should get the org by id', async () => {
    await updateOrg(req, res);
    expect(getOrgById).toHaveBeenCalledTimes(1);
    expect(getOrgById).toHaveBeenCalledWith('org1');
  });

  it('it should return 404 if no org exists with that id', async () => {
    getOrgById.mockReset().mockReturnValue(undefined);

    await updateOrg(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('it should update the organisation', async () => {
    await updateOrg(req, res);
    expect(updateOrganisation).toHaveBeenCalledTimes(1);
    expect(updateOrganisation).toHaveBeenCalledWith({
      id: 'organisation1',
      name: 'test org',
      urn: '1234',
      category: {
        id: '004',
        name: 'Early Years Setting',
      },
      legacyId: '12345'
      },
      {
        name: 'organisation2',
        urn: '1234',
        legacyId: '4567',
        category: {
          id: '004'
        }
      });
  });

});
