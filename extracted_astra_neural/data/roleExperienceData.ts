// FIX: Implemented role experience data to resolve module errors.
import { UserRole } from '../types';

export const roleExperienceData: Record<UserRole, {
    welcome_key: string;
    did_you_know_key: string;
    featured_tools: string[];
}> = {
    [UserRole.ARTIST]: {
        welcome_key: 'welcome_artist_title',
        did_you_know_key: 'did_you_know_artist',
        featured_tools: ['narrativeBuilder', 'atlasCultural', 'strategicCouncil'],
    },
    [UserRole.MANAGER]: {
        welcome_key: 'welcome_manager_title',
        did_you_know_key: 'did_you_know_manager',
        featured_tools: ['strategicCouncil', 'auditoriaInterna', 'valueProposition'],
    },
    [UserRole.PROJECT_MANAGER]: {
        welcome_key: 'welcome_pm_title',
        did_you_know_key: 'did_you_know_pm',
        featured_tools: ['laboratorioRobustez', 'timeAuditor', 'strategicCouncil'],
    },
    [UserRole.ENTREPRENEUR]: {
        welcome_key: 'welcome_entrepreneur_title',
        did_you_know_key: 'did_you_know_entrepreneur',
        featured_tools: ['valueProposition', 'strategicCouncil', 'swotAnalysis'],
    },
    [UserRole.STRATEGIC_COMMUNICATOR]: {
        welcome_key: 'welcome_communicator_title',
        did_you_know_key: 'did_you_know_communicator',
        featured_tools: ['narrativeBuilder', 'valueProposition', 'strategicCouncil'],
    },
    [UserRole.BOOK_AUTHOR]: {
        welcome_key: 'welcome_author_title',
        did_you_know_key: 'did_you_know_author',
        featured_tools: ['narrativeBuilder', 'ikigaiWorkshop', 'strategicCouncil'],
    },
};
