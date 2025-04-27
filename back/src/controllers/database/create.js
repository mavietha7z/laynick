import bcrypt from 'bcrypt';
import { User } from '~/models/user';
import { Product } from '~/models/product';
import { Partner } from '~/models/partner';
import { Setting } from '~/models/setting';
import { infoPartners, infoProducts, infoSetting, infoUsers } from '~/configs/database';

const controlAuthCreateDatabase = async () => {
    try {
        // Auth
        for (const user of infoUsers) {
            const { full_name, username, password, admin } = user;

            const isUser = await User.findOne({ username });
            if (isUser) {
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            await new User({
                admin,
                full_name,
                username,
                password: hashed,
            }).save();
        }

        // Products
        for (const product of infoProducts) {
            const { title, description, price, old_price, status } = product;

            const isProduct = await Product.findOne({ title });
            if (isProduct) {
                continue;
            }

            await new Product({
                title,
                description,
                price,
                old_price,
                status,
            }).save();
        }

        // infoPartners

        for (const partner of infoPartners) {
            const { partner_name, partner_id, partner_key, partner_url, status } = partner;

            const isPartner = await Partner.findOne({ partner_name });
            if (isPartner) {
                continue;
            }

            await new Partner({
                partner_name,
                partner_id,
                partner_key,
                partner_url,
                status,
            }).save();
        }

        // Setting
        const isSetting = await Setting.findOne({});
        if (!isSetting) {
            const { apikey_login, banner_url, charging_rank, notify } = infoSetting;

            await new Setting({
                apikey_login,
                banner_url,
                charging_rank,
                notify,
            }).save();
        }
    } catch (error) {
        console.log('error: ', error);
    }
};

export { controlAuthCreateDatabase };
