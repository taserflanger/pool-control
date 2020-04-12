import Category from "./Category";
import React, {Component} from "react";

/*
model: (default necessary, parenthethis optional,
respect order for readability)
-------------------------------------------------
  display: title, value, (unit), (mcp)
  PushButton: (title), (inner), value, (mcp)
  Button: (title), (inner), value, (mcp)
  ToggleAdjustButton: title, value: {isOn, value}, (unit)
  AdjustButton: title, value, (unit)

*/

export default class Page extends Component {
    render() {
        let result = []
        let titles = Object.keys(this.props.categories) // array of str
        for (let i=0; i<titles.length; i++) {
            let category = this.props.categories[titles[i]]
            let meta = {}
            for (let prop of Object.keys(category)) {
                if (!(prop=="items" || prop=="visible")) {
                    meta[prop] = category[prop];
                }
            }
            result.push(
                <Category
                    title={titles[i]}
                    items = {category.items}
                    visible={category.visible}
                    meta={meta}
                />
            )
        }
        return result;
    }
}

