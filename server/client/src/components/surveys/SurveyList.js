import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys, deleteSurvey } from '../../actions';

class SurveyList extends Component {
    componentDidMount(){
        this.props.fetchSurveys();
    }

    renderSurveys() {
        return this.props.surveys.reverse().map(survey => {
            return(
                <div key={survey._id} className="card darken-1">
                    <div className="card-content">
                    <span className="card-title">{survey.title}</span>
                    <p>
                        {survey.body}
                    </p>
                    <p className="right">
                        Last Responded: {new Date(survey.lastResponded).toLocaleDateString("sr-rs")}
                    </p><br/>
                    <p className="right">
                        Survey Sent On: {new Date(survey.dateSent).toLocaleDateString("sr-rs")}
                    </p>
                    </div>
                    <div className="card-action">
                        <a>Yes: {survey.yes}</a>
                        <a>No: {survey.no}</a>
                        <button 
                            style={{ marginTop: '-10px' }}
                            className="btn-flat red right white-text"
                            onClick={()=> this.props.deleteSurvey(survey._id)}>
                            Delete survey 
                            <i className="material-icons right">delete_forever</i>
                        </button>
                    </div>
                </div>
            ) 
        })
    }

    render() {
        return (
            <div>
                {this.renderSurveys()}
            </div>
        );
    }
}

function mapStateToProps({surveys}){
    return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys, deleteSurvey })(SurveyList);