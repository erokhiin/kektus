import React from 'react'
import SC from 'styled-components'

const Form = SC.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`
const Label = SC.label`
  display: flex;
  flex-direction: column;
`

const CreatePlant = () => {
  // const history = useHistory();
  return (
    <div>
      <h1>Create Plant</h1>
      <Form>
        <Label>
          Plant name
          <input type="text" name="name" />
        </Label>
        <Label>
          Watering frequency
          <div>
            <input type="number" name="count" />
            <select>
              <option>a week</option>
              <option>a two week</option>
              <option>a month</option>
            </select>
          </div>
        </Label>
        <input type="submit" value="Submit" />
      </Form>
    </div>
  )
}

export default CreatePlant
