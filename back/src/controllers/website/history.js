import { User } from "~/models/user";
import { formatMongoDate } from "~/configs";

const controlGetHistoryPage = async (req, res) => {
    try {
        const { id, membership } = req.user;

        const { history_hacks } = await User.findById(id).select("history_hacks");

        console.log("history_hacks :", history_hacks);

        let accounts = history_hacks.map((account) => {
            const { account_id, nickname, status, info, created_at } = account;

            return {
                account_id,
                nickname,
                status,
                info: membership === "vip" ? `${info.username}|${info.password}` : null,
                created_at: formatMongoDate(created_at),
            };
        });

        console.log("accounts :", accounts);

        res.render("history.ejs", { accounts });
    } catch (error) {
        console.log("error :", error);
        res.redirect("/login");
    }
};

export default controlGetHistoryPage;
