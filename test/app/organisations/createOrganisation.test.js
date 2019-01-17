jest.mock('./../../../src/infrastructure/data', () => {
  return {
    addOrganisation: jest.fn(),
    getNextOrganisationLegacyId: jest.fn(),
    getOrgByUrn: jest.fn(),
  }
});
jest.mock('uuid/v4');
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').mockLogger());

const { mockRequest, mockResponse } = require('./../../utils');
const { addOrganisation, getOrgByUrn, getNextOrganisationLegacyId } = require('./../../../src/infrastructure/data');
const createOrganisation = require('./../../../src/app/organisations/createOrganisation');
const uuid = require('uuid/v4');

const res = mockResponse();

describe('when creating a new organisation', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      body: {
        name: 'organisation1',
        urn: '12345',
        category: {
          id: '004',
        },
        legacyId: '4567'
      }
    });
    getOrgByUrn.mockReset();
    getNextOrganisationLegacyId.mockReset().mockReturnValue('legacyId');
    addOrganisation.mockReset();
    uuid.mockReset().mockReturnValue('new-uuid');
  });

  it('it should get check if org urn exists', async () => {
    await createOrganisation(req, res);
    expect(getOrgByUrn).toHaveBeenCalledTimes(1);
    expect(getOrgByUrn).toHaveBeenCalledWith('12345','004');
  });

  it('it should return 409 if urn exists for category', async () => {
    getOrgByUrn.mockReset().mockReturnValue({
      id: 'organisation1',
      name: 'test org',
      urn: '1234',
      category: {
        id: '004',
        name: 'Early Years Setting',
      },
      legacyId: '12345'
    });
    req.body.urn = '1234';

    await createOrganisation(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('it should generate legacyId if not passed in body', async () => {
    req.body.legacyId = null;

    await createOrganisation(req, res);
    expect(getNextOrganisationLegacyId).toHaveBeenCalledTimes(1);
  });

  it('it should create the organisation', async () => {
    await createOrganisation(req, res);
    expect(addOrganisation).toHaveBeenCalledTimes(1);
    expect(addOrganisation).toHaveBeenCalledWith({
      name: 'organisation1',
      urn: '12345',
      category: {
        id: '004',
      },
      legacyId: '4567',
      id: 'new-uuid',
    });
  });

  it('it return 201 created', async () => {
    await createOrganisation(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  
});

