// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useEffect, useMemo } from 'react';
import { MutateOptions } from '@tanstack/react-query';
import { useAskProductAIAssistant } from '../gateways/graphql/hooks';

export interface AiRequestPayload {
    question: string;
}

export type AiResponse = { text: string } | string;

interface AiAssistantContextValue {
    aiResponse: AiResponse | null;
    aiLoading: boolean;
    aiError: Error | null;
    sendAiRequest: (
        payload: AiRequestPayload,
        options?: MutateOptions<AiResponse, Error, AiRequestPayload, unknown>
    ) => void;
    reset: () => void;
}

const Context = createContext<AiAssistantContextValue>({
    aiResponse: null,
    aiLoading: false,
    aiError: null,
    sendAiRequest: () => {},
    reset: () => {},
});

export const useAiAssistant = () => useContext(Context);

interface ProductAIAssistantProviderProps {
    children: React.ReactNode;
    productId: string;
}

const ProductAIAssistantProvider = ({ children, productId }: ProductAIAssistantProviderProps) => {
    const mutation = useAskProductAIAssistant();

    useEffect(() => {
        mutation.reset();
    }, [productId, mutation]);

    const value = useMemo(
        () => ({
            aiResponse: mutation.data ?? null,
            aiLoading: mutation.isPending,
            aiError: mutation.error ?? null,
            sendAiRequest: (
                payload: AiRequestPayload,
                options?: MutateOptions<AiResponse, Error, AiRequestPayload, unknown>
            ) => {
                mutation.mutate({ productId, question: payload.question } as any, options as any);
            },
            reset: () => mutation.reset(),
        }),
        [mutation.data, mutation.isPending, mutation.error, productId, mutation]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ProductAIAssistantProvider;
