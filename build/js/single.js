var React = require('react');
var $ = require('jquery');
var PollBar = require('./pollBar');

var SinglePoll = React.createClass({
    getInitialState: function(){
      return({
          singleData: 'loading...',
          newOption: ''
      });  
    },
    componentWillMount: function(){
      $.get("/getsinglepoll/"+this.props._id, function(data){
          this.setState({singleData: data});
      }.bind(this));
    },
    handleClick: function(name, vote, address){
        var data = this.state.singleData;
        var options = JSON.parse(data.options);
        options[address][1]++;
        data.options = JSON.stringify(options);
        this.setState({
           singleData: data 
        });
        $.post("/addVotePoint", {
                _id: this.state.singleData._id,
                index: address
            }, function(result){}.bind(this));
    },
    getNewOptions: function(e){
        this.setState({
            newOption: e.target.value
        });
    },
    addOption: function(value){
        var data = this.state.singleData;
        var options = JSON.parse(data.options);
        options.push([value, 0]);
        data.options = JSON.stringify(options);
        this.setState({
            newOption: '',
            singleData: data
        });
        $.post("/addVoteOption", {
                _id: this.state.singleData._id,
                newVoteOption: value 
            }, function(result){}.bind(this));
    },
    render: function(){
        var generateSinglePoll = this.state.singleData === 'loading...' ? 'loading...' :
            (<div className="row">
                    <div className="col-xs-12 text-center poll">{this.state.singleData.name}</div>
                    <div className="col-xs-12 polldata" style={{display: "block"}}>
                        <iframe src={"https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fvoteapp-quanghuyf.c9users.io%2Fpoll%2F"+this.state.singleData._id+"&layout=button_count&size=small&mobile_iframe=true&appId=970839202959797&width=68&height=20"} width="68" height="20" style={{border:"none",overflow:"hidden"}} scrolling="no" frameBorder="0" allowTransparency="true"></iframe>
                        <h4>Click the chart to vote</h4>
                        {JSON.parse(this.state.singleData.options).map(function(item, i){
                            return (
                                <PollBar key={"item"+i} name={item[0]} vote={item[1]} addVote={this.handleClick} address={i}/>
                            );
                        }.bind(this))}
                        <div style={{"display": this.props.cantAdd ? "none" : "block"}}>
                        <h4>or Add a new option</h4>
                        <input className="form-control form-group" type="text" onChange={this.getNewOptions} value={this.state.newOption}/>
                        <input type="submit" className="btn btn-primary form-group" value="Add option" 
                        onClick={this.addOption.bind(this, this.state.newOption)} disabled={this.state.newOption === '' ? true : false} />
                        </div>
                    </div>
                </div>);
        return <section>{generateSinglePoll}</section>;
    }
});

module.exports = SinglePoll;