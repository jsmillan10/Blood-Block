import React from 'react';
import ReactLoading from 'react-loading';

function Loading() {
    return (
        <div className="loading-dialog">
            <ReactLoading color="#3071F2" type="balls"/>
        </div>
    );
}

export default Loading;