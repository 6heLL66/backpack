import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../../api";

export const useAccounts = () => {
    const query = useQuery({
        queryKey: ['accounts'],
        queryFn: () => AccountService.accountsListApiBackpackAccountsGet()
    })

    return query;
}