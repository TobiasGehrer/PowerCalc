using PowerCalc.Models;

namespace PowerCalc.Services.Abstractions
{
    public interface ILifterService
    {
        List<Lifter> GetAllLifters();
        Lifter? GetLifter(string name);
        void UpdateLifter(Lifter lifter);
    }
}
