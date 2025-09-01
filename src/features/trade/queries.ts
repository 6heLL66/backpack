import { useQuery } from "@tanstack/react-query";
import { AccountService, DefaultService, MarketsService } from "../../api";
import { useAccounts } from "../accounts/queries";

export const useMarkets = () => {
    const query = useQuery({
        queryKey: ['markets'],
        queryFn: () => MarketsService.getMarketsApiBackpackMarketsGet().then(res => res.filter((market: any) => market.marketType === 'PERP'))
    })

    const prices = useQuery({
        queryKey: ['prices'],
        queryFn: () => MarketsService.getMarkPricesApiBackpackMarketsPricesGet(),
        refetchInterval: 30000
    })

    const getMarketBySymbol = (symbol: string) => {
        return query.data?.find((market: any) => market.symbol === symbol);
    }

    const getQuantityDecimalsBySymbol = (symbol: string) => {
        return getMarketBySymbol(symbol)?.filters.quantity.stepSize?.split('.')[1].length;
    }

    const getPriceBySymbol = (symbol: string) => {
        return prices.data?.find((price: any) => price.symbol === symbol)?.markPrice;
    }

    return {query, getMarketBySymbol, getPriceBySymbol, getQuantityDecimalsBySymbol};
}

export const useActiveUnits = () => {
    const unitsQuery = useQuery({
        queryKey: ['active-units'],
        queryFn: () => DefaultService.unitsListApiBackpackUnitsGet({ isActive: true })
    });

    return unitsQuery;
}

export const useDeletedUnits = () => {
    const unitsQuery = useQuery({
        queryKey: ['deleted-units'],
        queryFn: () => DefaultService.unitsListApiBackpackUnitsGet({ isActive: false })
    });

    return unitsQuery;
}

export const useBatchPositions = (batchId: string) => {
    const { data: accounts } = useAccounts();

    const batchAccounts = accounts?.filter(account => account.batch_id === batchId);

    const query = useQuery({
        queryKey: ['batchPositions', batchId, batchAccounts],
        queryFn: () => AccountService.accountsPositionsApiBackpackAccountsPositionsGet({ accountIds: batchAccounts?.map(account => account.id) || [] }),
        refetchInterval: 5000
    })

    const positions = query.data ?? {};

    return {query, positions};
}

export const useBatchBalances = (batchId: string) => {
    const { data: accounts } = useAccounts();

    const batchAccounts = accounts?.filter(account => account.batch_id === batchId);

    const query = useQuery({
        queryKey: ['batchBalances', batchId, batchAccounts],
        queryFn: () => AccountService.accountsBalancesApiBackpackAccountsBalancesGet({ accountIds: batchAccounts?.map(account => account.id) || [] }),
        refetchInterval: 30000
    })

    return {query, balances: query.data};
}

export const useBatchOrders = (batchId: string) => {
    const { data: accounts } = useAccounts();

    const batchAccounts = accounts?.filter(account => account.batch_id === batchId);

    const query = useQuery({
        queryKey: ['batchOrders', batchId, batchAccounts],
        queryFn: () => AccountService.accountsOrdersApiBackpackAccountsOrdersGet({ accountIds: batchAccounts?.map(account => account.id) || [] }),
        refetchInterval: 5000
    })

    return {query, orders: query.data};
}

export const useUnitHistory = (unitId: string) => {
    const query = useQuery({
        queryKey: ['unitHistory', unitId],
        queryFn: () => DefaultService.unitsHistoryApiBackpackUnitsHistoryGet({ unitId }),
        enabled: !!unitId
    });

    return query;
};