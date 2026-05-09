import { BaseAuthPayload, BaseAuthViewProps } from "../../types";
import type { TwoFactorMethod } from '../../types';

export interface LoginPayload extends BaseAuthPayload {}

export interface LoginViewProps extends BaseAuthViewProps {
	twoFactorRequired: boolean;
	twoFactorCode: string;
	setTwoFactorCode: (value: string) => void;
	twoFactorNotice: string | null;
	twoFactorMethods: TwoFactorMethod[];
	selectedTwoFactorMethod: TwoFactorMethod;
	setSelectedTwoFactorMethod: (value: TwoFactorMethod) => void;
	onSendTwoFactorCode: () => Promise<void>;
	sendingTwoFactorCode: boolean;
	onResetTwoFactor: () => void;
}
