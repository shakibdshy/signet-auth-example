# Signet Feature Showcase

The public example application that makes Signet's shipped auth capabilities visible and
explorable from a real frontend.

## Language

**Showcase**:
The example application itself, read by developers deciding whether to adopt Signet.
_Avoid_: demo app, sample project, playground

**Feature area**:
A group of related Signet capabilities presented together because a developer evaluates them together.
_Avoid_: category, module, section, tab

**Live flow**:
An interaction in the showcase that completes against the deployed Signet backend.
_Avoid_: working demo, enabled feature

**Gated feature**:
A shipped Signet capability the showcase presents but cannot complete against the current deployment because it needs an administrator role or provider configuration.
_Avoid_: disabled feature, broken feature, mock

**Dev inbox**:
The panel where a tester pastes a token or link emitted by the backend mailer to finish a flow.
_Avoid_: email viewer, outbox, inbox simulation

**Demo account**:
The seeded credential on the deployed backend used to show signed-in screens.
_Avoid_: test user, admin user, fixture

**Status badge**:
The label telling a reader whether a capability is Live, Needs Role, or Needs Server Config.
_Avoid_: health indicator, feature flag
