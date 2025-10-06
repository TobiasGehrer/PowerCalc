using PowerCalc.Models;

namespace PowerCalc.Services.Abstractions
{
    public interface IStateService
    {
        AppState GetState();
        void UpdateState(AppState state);
        void AdvanceDay();
    }
}
