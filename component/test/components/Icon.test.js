import Icon from '../../src/components/Icon'

it('should render clear-day Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="clear-day" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render clear-night Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="clear-night" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render rain Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="rain" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render snow Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="snow" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render sleet Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="sleet" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render wind Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="wind" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render fog Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="fog" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render cloudy Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="cloudy" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render partly-cloudy-day Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="partly-cloudy-day" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render partly-cloudy-night Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="partly-cloudy-night" />
    )
    expect(wrapper).toMatchSnapshot()
})

it('should render default Icon correctly', () => {
    const wrapper = shallow(
        <Icon name="anyvaluethatdoesntexist" />
    )
    expect(wrapper).toMatchSnapshot()
})