import Icon from '../../src/components/Icon'

it('should render clear-day Icon correctly', () => {
    const component = shallow(
        <Icon name="clear-day" />
    )
    expect(component).toMatchSnapshot()
})

it('should render clear-night Icon correctly', () => {
    const component = shallow(
        <Icon name="clear-night" />
    )
    expect(component).toMatchSnapshot()
})

it('should render rain Icon correctly', () => {
    const component = shallow(
        <Icon name="rain" />
    )
    expect(component).toMatchSnapshot()
})

it('should render snow Icon correctly', () => {
    const component = shallow(
        <Icon name="snow" />
    )
    expect(component).toMatchSnapshot()
})

it('should render sleet Icon correctly', () => {
    const component = shallow(
        <Icon name="sleet" />
    )
    expect(component).toMatchSnapshot()
})

it('should render wind Icon correctly', () => {
    const component = shallow(
        <Icon name="wind" />
    )
    expect(component).toMatchSnapshot()
})

it('should render fog Icon correctly', () => {
    const component = shallow(
        <Icon name="fog" />
    )
    expect(component).toMatchSnapshot()
})

it('should render cloudy Icon correctly', () => {
    const component = shallow(
        <Icon name="cloudy" />
    )
    expect(component).toMatchSnapshot()
})

it('should render partly-cloudy-day Icon correctly', () => {
    const component = shallow(
        <Icon name="partly-cloudy-day" />
    )
    expect(component).toMatchSnapshot()
})

it('should render partly-cloudy-night Icon correctly', () => {
    const component = shallow(
        <Icon name="partly-cloudy-night" />
    )
    expect(component).toMatchSnapshot()
})

it('should render default Icon correctly', () => {
    const component = shallow(
        <Icon name="anyvaluethatdoesntexist" />
    )
    expect(component).toMatchSnapshot()
})