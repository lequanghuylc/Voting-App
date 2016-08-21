var React = require('react');

var CreatePoll = React.createClass({
    handleContent: function(){
        var optionsArr = [];
        this.refs.options.value.split("\n").map(function(val, index){
            optionsArr.push([val, 0]);
        });
        this.props.content({
            name: this.refs.name.value,
            options: JSON.stringify(optionsArr)
        });
    },
    render: function(){
       return (
         <div>
           <h1>Create Poll</h1>
           <form onSubmit={this.props.submit}>
            <input type="text" className="form-control form-group" placeholder="Type name of the poll" ref="name" onChange={this.handleContent}/>
            <textarea className="form-control form-group" placeholder="Each line for each option" ref="options" rows="8" onChange={this.handleContent}/>
            <input type="submit" className="btn btn-primary form-group" value="submit" disabled={this.props.isDisable}/>
           </form>
         </div>
    );
   } 
});

module.exports = CreatePoll;