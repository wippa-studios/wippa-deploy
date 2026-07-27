import { isNil } from '@wippa/core-utils';
import { ActionBase } from '@wippa/connectors-framework';
import {
  AgentPieceTool,
  AgentToolType,
  PredefinedInputsStructure,
  mcpToolNameUtils,
} from '@wippa/shared';
import { create } from 'zustand';

import { PieceStepMetadataWithSuggestions } from '@/features/connectors/types';

type SelectedDialogPage = 'pieces-list' | 'actions-list' | 'action-inputs';

interface PiecesToolDialogsState {
  showAddPieceDialog: boolean;
  selectedPage: SelectedDialogPage;
  searchQuery: string;
  selectedPiece?: PieceStepMetadataWithSuggestions;
  selectedAction?: ActionBase;
  predefinedInputs?: PredefinedInputsStructure;
  editingPieceTool?: AgentPieceTool;

  setSelectedPage: (page: SelectedDialogPage) => void;
  setSearchQuery: (query: string) => void;
  setPredefinedInputs: (inputs: PredefinedInputsStructure) => void;

  openAddPieceToolDialog: ({
    page,
    tool,
    piece,
  }: {
    page?: SelectedDialogPage;
    tool?: AgentPieceTool;
    piece?: PieceStepMetadataWithSuggestions;
  }) => void;

  handlePieceSelect: (piece: PieceStepMetadataWithSuggestions) => void;
  handleActionSelect: (action: ActionBase) => void;
  goBackToPiecesList: () => void;
  goBackToActionsList: () => void;

  isPieceAuthSet: () => boolean;

  createNewPieceTool: () => AgentPieceTool | null;
  closePieceDialog: () => void;
  resetDialogState: () => void;
}

const initialState = {
  showAddPieceDialog: false,
  selectedPage: 'pieces-list' as SelectedDialogPage,
  searchQuery: '',
  selectedPiece: undefined,
  selectedAction: undefined,
  predefinedInputs: undefined,
  editingPieceTool: undefined,
};

export const usePieceToolsDialogStore = create<PiecesToolDialogsState>(
  (set, get) => ({
    ...initialState,

    setSelectedPage: (page) => set({ selectedPage: page }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setPredefinedInputs: (inputs) => set({ predefinedInputs: inputs }),
    openAddPieceToolDialog: ({ page = 'pieces-list', tool, piece }) => {
      set({
        showAddPieceDialog: true,
        selectedPage: page,
        editingPieceTool: tool,
        predefinedInputs: tool?.connectorMetadata.predefinedInput,
        selectedPiece: piece,
      });
    },
    handlePieceSelect: (piece) => {
      set({
        selectedPiece: piece,
        selectedPage: 'actions-list',
      });
    },
    handleActionSelect: (action) => {
      set({
        selectedAction: action,
        selectedPage: 'action-inputs',
      });
    },
    goBackToPiecesList: () => {
      set({
        selectedPage: 'pieces-list',
      });
      get().resetDialogState();
    },
    goBackToActionsList: () => {
      set({
        selectedPage: 'actions-list',
        selectedAction: undefined,
        predefinedInputs: undefined,
      });
    },
    isPieceAuthSet: () => {
      const { selectedPiece, selectedAction, predefinedInputs } = get();

      if (isNil(selectedPiece) || isNil(selectedAction)) {
        return false;
      }

      if (!selectedAction.requireAuth || isNil(selectedPiece.auth)) {
        return true;
      }

      if (!isNil(predefinedInputs?.auth)) {
        return true;
      }

      return false;
    },
    createNewPieceTool: () => {
      const {
        selectedAction,
        selectedPiece,
        predefinedInputs,
        isPieceAuthSet,
      } = get();

      if (!selectedAction || !selectedPiece || !isPieceAuthSet()) {
        return null;
      }

      return {
        type: AgentToolType.PIECE,
        toolName: mcpToolNameUtils.createPieceToolName(
          selectedPiece.connectorName,
          selectedAction.name,
        ),
        connectorMetadata: {
          connectorVersion: selectedPiece.connectorVersion,
          connectorName: selectedPiece.connectorName,
          actionName: selectedAction.name,
          predefinedInput: predefinedInputs || undefined,
        },
      };
    },
    resetDialogState: () => {
      set({
        searchQuery: '',
        selectedPiece: undefined,
        selectedAction: undefined,
        predefinedInputs: undefined,
        editingPieceTool: undefined,
        selectedPage: 'pieces-list',
      });
    },
    closePieceDialog: () => {
      set({ showAddPieceDialog: false });
      get().resetDialogState();
    },
  }),
);
