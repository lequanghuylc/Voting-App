var React = require('react');
var $ = require('jquery');
var PollBar = require('./pollBar');

var MyPoll = React.createClass({
    getInitialState: function(){
      return({
          newOption: ''
      });  
    },
    componentWillMount: function(){
      $.get("/getpollfromuser/"+this.props.username, function(data){
          this.props.userPolls(data);
      }.bind(this));
    },
    handleClick: function(name, vote, address){
        
    },
    getNewOptions: function(e){
        this.setState({
            newOption: e.target.value
        });
    },
    addOption: function(index, value){
        this.props.addOptions(index, value);
        this.setState({
            newOption: ''
        });
    },
    delete: function(id, index){
        this.props.delete(id, index);
    },
    render: function(){
        return (
            <section>
            {typeof this.props.data === "string" ? this.props.data : 
                this.props.data.map(function(val, index){
            return (
                <div className="row" key={index}>
                    <div className="col-xs-12 text-center poll">{val.name}</div>
                    <div className="col-xs-12 polldata">
                        <h5><em><a href={"/poll/"+val._id} target="_blank">Single Link</a></em></h5>
                        <iframe src={"https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fvoteapp-quanghuyf.c9users.io%2Fpoll%2F"+val._id+"&layout=button_count&size=small&mobile_iframe=true&appId=970839202959797&width=68&height=20"} width="68" height="20" style={{border:"none",overflow:"hidden"}} scrolling="no" frameBorder="0" allowTransparency="true"></iframe>
                        <h4>Click the chart to vote</h4>
                        {JSON.parse(val.options).map(function(item, i){
                            return (
                                <PollBar key={"item"+i} name={item[0]} vote={item[1]} addVote={this.handleClick} address={[index, i]}/>
                            );
                        }.bind(this))}
                        <div style={{"display": this.props.cantAdd ? "none" : "block"}}>
                        <h4>or Add a new option</h4>
                        <input className="form-control form-group" type="text" onChange={this.getNewOptions} value={this.state.newOption}/>
                        <input type="submit" className="btn btn-primary form-group" value="Add option" 
                        onClick={this.addOption.bind(this, index, this.state.newOption)} disabled={this.state.newOption === '' ? true : false} />
                        <input type="submit" className="btn btn-danger form-group" value="Delete Poll" 
                        onClick={this.delete.bind(this, val._id, index)} />
                        </div>
                    </div>
                </div> 
                );
        }.bind(this))
            }
            </section>    
        );
    }
});

module.exports = MyPoll;