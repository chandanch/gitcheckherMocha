var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var sinon = require("sinon");
var PassThrough = require("stream").PassThrough;
var http = require("https");

var gitService = require("../../services/gitService")();

chai.use(chaiAsPromised);
chai.should();

describe("GitService", function () {
  
  beforeEach(function(){
    this.request = sinon.stub(http, 'request');
  });

  it("should get a user and repos", function () {
    this.timeout(10000); 
    const gitJson = {login: 'chandanch'};
    const repoJson = [{name: 'angularproj'}]
    const gitResponse = new PassThrough();
    gitResponse.write(JSON.stringify(gitJson));
    gitResponse.end();

    const reposResponse = new PassThrough();
    reposResponse.write(JSON.stringify(repoJson));
    reposResponse.end();

    this.request
    .onFirstCall().callsArgWith(1, gitResponse).returns(new PassThrough())
    .onSecondCall().callsArgWith(1, reposResponse).returns(new PassThrough());

    return gitService.getUser("chandanch").then( (user) => {
      var params = this.request.getCall(0).args;
      console.log('params', this.request.getCall(0).args); 

      params[0].headers['User-Agent'].should.equal('gitExample');
      this.request.getCall(1).args[0].path.should.equal('/users/chandanch/repos')
      user.login.should.equal('chandanch');
      user.should.property('repos');
    });
  });

  afterEach(function(){
      http.request.restore();
  });
});
