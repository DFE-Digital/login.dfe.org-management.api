jest.mock('./../../../src/infrastructure/data', () => {
  return {
    deleteOrganisation: jest.fn(),
  }
});

jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').mockLogger());

const { mockRequest, mockResponse } = require('./../../utils');
const { deleteOrganisation } = require('./../../../src/infrastructure/data');
const deleteOrg = require('./../../../src/app/organisations/deleteOrganisation');

const res = mockResponse();

describe('when deleting an organisation by id', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'organisation1',
      },
    });

    deleteOrganisation.mockReset();
  });

  it('it should delete the org by id', async () => {
    await deleteOrg(req, res);
    expect(deleteOrganisation).toHaveBeenCalledTimes(1);
    expect(deleteOrganisation).toHaveBeenCalledWith(req.params.id, req.correlationId);
  });

  it('then it should return 204 no content', async () => {

    await deleteOrg(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

});
