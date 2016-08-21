var React = require('react');
var $ = require('jquery');
var MenuLi = require('./menuLi');
var ReactDOM = require('react-dom');
var CreatePoll = require('./create');
var ViewPoll = require('./view');
var SinglePoll = require('./single');
var MyPoll = require('./mine');
var Vote = React.createClass({
    getInitialState: function(){
      return ({
          username: '',
          password: '',
          loginMessage: '',
          notLoggedin: true,
          showForm: false,
          action: "view poll",
          newPollData: {},
          pollData: [],
          voteHistory: [],
          userData: "loading..."
      });  
    },
    componentWillMount: function(){
        if(window.location.pathname.indexOf("/poll/") === 0 && window.location.pathname.length > 6){
            this.setState({action: "single poll"})
        }
        $.get( "/checklogin", function( data ) {
          if(data !== "false"){
              this.setState({notLoggedin: false, username:data, showForm: false});
          } else {
              this.setState({showForm: true});
          }
        }.bind(this));
        $.get( "/getpoll", function( data ) {
            var historyArr = [];
          data.forEach(function(val, i){
              historyArr.push([i, false]);
          });        
          this.setState({pollData: data, voteHistory: historyArr});
        }.bind(this));
    },
    handleInputLogin: function(e){
        this.setState({
            username: this.refs.username.value,
            password: this.refs.password.value
        });
    },
    handleForm: function(e){
        e.preventDefault();
        if(this.state.username == '' || this.state.password == ''){
            this.setState({
                loginMessage: 'Please enter username/password'
            });
        } else {
            this.setState({ loginMessage: ''});
            $.post("/login", {user: this.state.username, pass: this.state.password}, function(result){
                this.setState({
                    loginMessage: result.accept ? "login succes" : "wrong user/pass",
                    notLoggedin: result.accept ? false : true,
                    showForm: result.accept ? false : true,
                });
                // clear all cookie
                document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                // add my new cookie
                document.cookie = result.accept ? "user=" + this.state.username + ";" : null;
                document.cookie = result.accept ? "au=" + result.cookie + ";"  : null;
            }.bind(this));
        }
    },
    logout: function(e){ 
      e.preventDefault();
          this.setState({
            notLoggedin: true,
            showForm: true
          });
          //clear cookie
          document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });  
        return false;
        
    }, 
    addPoll: function(e){
        e.preventDefault();
        var newData = this.state.newPollData;
        newData.username = this.state.username;
        var data = this.state.pollData;
        var historyArr = this.state.voteHistory;
        $.post("/add", newData, function(result){
            data.push(result);
            historyArr.push([data.length-1, false]);
            this.setState({
                newPollData: {},
                pollData: data, 
                voteHistory: historyArr
            });
            this.actionViewPoll();
        }.bind(this));
    },
    addVote: function(name, vote, address){
        if(this.state.voteHistory[address[0]][1]){
            alert("you voted already");
        } else {
            var data = this.state.pollData;
            var options = JSON.parse(data[address[0]].options);
            options[address[1]] = [name, vote];
            data[address[0]].options = JSON.stringify(options);
            var historyArr = this.state.voteHistory;
            historyArr[address[0]][1] = true;
            this.setState({
                pollData: data,
                voteHistory: historyArr
            });
            $.post("/addVotePoint", {
                _id: data[address[0]]._id,
                index: address[1]
            }, function(result){}.bind(this));
        }
    },
    addOptionsUser: function(index, value){
        var data = this.state.userData;
        var options = JSON.parse(data[index].options);
        options.push([value, 0]);
        data[index].options = JSON.stringify(options);
        this.setState({
            userData: data
        });
        $.post("/addVoteOption", {
                _id: data[index]._id,
                newVoteOption: value 
            }, function(result){}.bind(this));
    },
    addOptions: function(index, value){
        var data = this.state.pollData;
        var options = JSON.parse(data[index].options);
        options.push([value, 0]);
        data[index].options = JSON.stringify(options);
        this.setState({
            pollData: data
        });
        $.post("/addVoteOption", {
                _id: data[index]._id,
                newVoteOption: value 
            }, function(result){}.bind(this));
    },
    receiveNewData: function(val){
        this.setState({newPollData: val});
    },
    getUserPoll:function(data){
        this.setState({
           userData: data 
        });
    },
    userDeletePoll: function(id, index){
        var data = this.state.userData;
        var newData = data.slice(0, index).concat(data.slice(index + 1, data.length));
        this.setState({
            userData: newData
        });
        $.get("/deletepoll/"+id, function(result){}.bind(this));
    },
    actionAddPoll: function(){
        this.setState({action: "create poll"});
    },
    actionMyPoll: function(){
        this.setState({action: "my poll"});
    },
    actionViewPoll: function(){
        this.setState({action: "view poll"});
        // this get data function is to make things updated
        $.get( "/getpoll", function( data ) {
            var historyArr = [];
          data.forEach(function(val, i){
              historyArr.push([i, false]);
          });        
          this.setState({pollData: data, voteHistory: historyArr});
        }.bind(this));
    },
    render: function(){
        switch(this.state.action){
            case "create poll": var generateAction = <CreatePoll submit={this.addPoll} content={this.receiveNewData} 
                isDisable={this.state.newPollData.name === undefined || this.state.newPollData.options[0] === "" ? true : false} />;
                break;
            case "view poll": var generateAction = <ViewPoll data={this.state.pollData} addVote={this.addVote} 
                cantAdd={this.state.notLoggedin} addOptions={this.addOptions}/>;
                break;
            case "single poll": var generateAction = <SinglePoll _id={window.location.pathname.substring(6)}/>;
                break;
            case "my poll": var generateAction = <MyPoll username={this.state.username} userPolls={this.getUserPoll} 
                data={this.state.userData} addOptions={this.addOptionsUser} delete={this.userDeletePoll} />;
                break;
        }
        if(this.state.notLoggedin === false){
            var generateMenuLi = [
                <MenuLi text={"Welcome "+this.state.username} key="1"/>,
                <MenuLi text="View Polls" key="2" addPoll={this.actionViewPoll} />,
                <MenuLi text="Create Poll" key="3" addPoll={this.actionAddPoll} />,
                <MenuLi text="My Polls" key="4" myPoll={this.actionMyPoll} />,
                <MenuLi text="Logout" logout={this.logout} key="5"/>
                ];
            var generateLoginForm = [];
        } else {
            var generateMenuLi = [];
            var generateLoginForm = this.state.showForm === false ? [] : [
                <form className="navbar-form navbar-right form-inline" role="search" onSubmit={this.handleForm} key={"loginform"}>
                  <div className="form-group">
                    <span className="login-notify">{this.state.loginMessage}</span>
                    <input type="text" className="form-control" placeholder="Username" ref="username" onChange={this.handleInputLogin}/>
                    <input type="password" className="form-control" placeholder="Password" ref="password" onChange={this.handleInputLogin}/>
                  </div>
                  <button type="submit" className="btn btn-default">Login or Register</button>
                </form>
                ];
        }
        
    return (
        <div>
        <header>
      <nav className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">Voting App</a>
            </div>
            <div className="collapse navbar-collapse" id="collapse">
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="/">Home</a></li>
                    {generateMenuLi}
                </ul>
                {generateLoginForm}
            </div>
            </nav>
            </header>
            <main>
                {generateAction}
            </main>
            </div>
    );
  }
});

ReactDOM.render(<Vote />, document.querySelector(".container"));

