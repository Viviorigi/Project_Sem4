import JoditReact, { Jodit } from 'jodit-react';
import React, { useRef } from 'react'

const JoditEditor: React.FC = (props:any) => {
    const {answer} = props;
    const [value, setValue] = React.useState<string>();
  
    return (
      <div>
        <JoditReact onChange={(content) => setValue(content)} value={'Hi'} />
      </div>
    );
  };
  
  export default JoditEditor;
