const rewire = require('rewire');
var sinon = require("sinon");

var GitCtrl = rewire('../../controllers/gitController');
var gitController = GitCtrl();
var chai = require('chai');

chai.should();

var getUser;

describe('gitController', function() {

    beforeEach(() => {
        // pull get service out
        const gitService = GitCtrl.__get__('gitService');
        getUser = sinon.spy(gitService, 'getUser');
        GitCtrl.__set__('gitService', gitService)
    })

    it('should get user & repos from git controller', function(done) {
        this.timeout(10000);
        var req = {params: {userId: 'chandanch'}};
        var res = {json: test}

        function test(user) {
            getUser.getCall(0).args[0].should.equal('chandanch');
            getUser.calledOnce.should.be.true;
            user.login.should.equal('chandanch');
            done();
        }

        gitController.userGet(req, res)
    })
})