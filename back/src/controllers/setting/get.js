import axios from 'axios';
import { Setting } from '~/models/setting';
import { urlApiKeyLogin } from '~/configs';
import controlCreateSettings from './create';

const controlGetSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne({});

        if (!setting) {
            setting = await controlCreateSettings();
        }

        const { _id, created_at, updated_at, __v, apikey_login, ...other } = setting._doc;

        try {
            const apikeyInfo = await axios.get(`${urlApiKeyLogin}/apikey`, {
                headers: {
                    Authorization: 'Bearer ' + apikey_login,
                },
            });

            if (apikeyInfo.data.status === 200) {
                setting = {
                    apikey_login: apikeyInfo.data.data,
                    ...other,
                };
            }
        } catch (error) {
            setting = {
                apikey_login: {
                    apikey: apikey_login,
                    status: false,
                    used: '',
                    expired_at: '',
                },
                ...other,
            };
        }

        res.status(200).json({
            status: 200,
            data: setting,
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlGetSettings;
