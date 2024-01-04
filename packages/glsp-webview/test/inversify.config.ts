import createContainer from "../src/di.config"

const widgetId = "test-widget"
const container = createContainer(widgetId)
export { container as mainContainer }