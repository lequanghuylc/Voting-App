var React = require('react');

var PollBar = React.createClass({
    handleClick: function(){
      this.props.addVote(this.props.name, (Number(this.props.vote) + 1), this.props.address);
    },
    render: function(){
        return (
           <div className="row votepoll" onClick={this.handleClick}>
            <div className="col-sm-3 col-xs-12">{this.props.name+" ("+this.props.vote+")"}</div>
            <div className="col-sm-9 col-xs-12">
                <div className="chartbar" style={{"width": this.props.vote + "%"}}></div>
            </div>
           </div> 
        );
    }
});

module.exports = PollBar;