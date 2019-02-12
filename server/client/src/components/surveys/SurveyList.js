import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {fetchSurveys, deleteSurvey} from '../../actions';

class SurveyList extends Component {
  componentDidMount () {
    this.props.fetchSurveys ();
    this.count = 0;
  }

  renderResponded (lastResponded) {
    return (
      <p className="right">
        Last Responded: {' '}
        {new Date (lastResponded).toLocaleDateString ('sr-rs')}
      </p>
    );
  }

  renderOptions (options) {
    return options.map (option => {
      this.count += option.count;
      return (
        <Fragment>
          Voted for
          <a key={option.name}> {option.name}: {option.count}<br /></a>
          {' '}
        </Fragment>
      );
    });
  }

  renderSurveys () {
    return this.props.surveys.reverse ().map (survey => {
      return (
        <div key={survey._id} className="card darken-1">
          <div className="card-content">
            <span className="card-title">{survey.title}</span>
            <p>
              {survey.body}
            </p>
            {survey.lastResponded &&
              this.renderResponded (survey.lastResponded)}
            <br />
            <p className="right">
              Survey Sent On: {' '}
              {new Date (survey.dateSent).toLocaleDateString ('sr-rs')}
            </p>
          </div>
          <div className="card-action">
            {this.renderOptions (survey.options)}
            <hr />
            Sent mails: <a>{survey.countRecipients}</a>
            <br />
            Responded mails: <a>{this.count}</a>
            <button
              style={{position: 'absolute', right: '20px', bottom: '20px'}}
              className="btn-flat red right white-text"
              onClick={() => this.props.deleteSurvey (survey._id)}
            >
              Delete survey
              <i className="material-icons right">delete_forever</i>
            </button>
          </div>
        </div>
      );
    });
  }

  render () {
    return (
      <div>
        {this.renderSurveys ()}
      </div>
    );
  }
}

function mapStateToProps({surveys}) {
  return {surveys};
}

export default connect (mapStateToProps, {fetchSurveys, deleteSurvey}) (
  SurveyList
);
