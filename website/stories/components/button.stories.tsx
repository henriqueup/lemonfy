import { Button, ButtonProps } from '../../components/button/button';
import { Story } from '@storybook/react';

export default {
    title: 'Button',
    component: Button,
};

const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    variant: '',
};

export const Primary = Template.bind({});
Primary.args = {
    variant: 'primary',
};

export const Success = Template.bind({});
Success.args = {
    variant: 'success',
};

export const Error = Template.bind({});
Error.args = {
    variant: 'error',
};
