const _ = require ('lodash');
const keys = require ('../../config/keys');

const renderOptions = (options, id) => {
  console.log (options);
  return _.map (options, ({name}) => {
    return `
                <a href="${keys.redirectDomain}/api/surveys/${id}/${name}">
                    ${name}
                </a><br/>
            `;
  }).join ('');
};

module.exports = ({id, options, body}) => {
  return `
        <html>
            <body>
                <div style="text-align: center;">
                    <h3>I'd like your input!</h3>
                    <p>Please answer the fallowing question:</p>
                    <p>${body}</p>
                    <div>
                        ${renderOptions (options, id)}
                    </div>
                </div>
            </body>
        </html>
    `;
};
