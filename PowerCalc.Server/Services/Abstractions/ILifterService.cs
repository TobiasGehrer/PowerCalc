using PowerCalc.Models;

namespace PowerCalc.Services.Abstractions
{
    public interface ILifterService
    {
        List<Lifter> GetAllLifters();
        Lifter? GetLifter(string name);
        void AddLifter(Lifter lifter);
        void UpdateLifter(string name, Lifter lifter);
        void DeleteLifter(string name);
    }
}
